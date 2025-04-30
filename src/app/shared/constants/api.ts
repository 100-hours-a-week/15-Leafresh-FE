export const API = {
    challenges: {
      // 이벤트 챌린지 목록
      events: { method: 'GET' as const, path: '/api/challenges/events' },
  
      // 개인 챌린지 목록
      personal: { method: 'GET' as const, path: '/api/challenges/personal' },
  
      // 개인 챌린지 상세
      personalDetail: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/challenges/personal/${challengeId}+`,
      }),
  
      // 개인 챌린지 규칙
      personalRules: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/challenges/personal/${challengeId}/rules`,
      }),
  
      // 단체 챌린지 카테고리 목록
      groupCategories: { method: 'GET' as const, path: '/api/challenges/group/categories' },
  
      // 단체 챌린지 목록
      groupList: { method: 'GET' as const, path: '/api/challenges/group' },
  
      // 단체 챌린지 생성
      createGroup: { method: 'POST' as const, path: '/api/challenges/group' },
  
      // 단체 챌린지 수정
      updateGroup: (challengeId: number) => ({
        method: 'PATCH' as const,
        path: `/api/challenges/group/${challengeId}`,
      }),
  
      // 단체 챌린지 삭제
      deleteGroup: (challengeId: number) => ({
        method: 'DELETE' as const,
        path: `/api/challenges/group/${challengeId}`,
      }),
  
      // 단체 챌린지 상세
      groupDetail: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/challenges/group/${challengeId}`,
      }),
  
      // 단체 챌린지 인증 목록
      groupVerifications: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/challenges/group/${challengeId}/verifications`,
      }),
  
      // 단체 챌린지 규칙
      groupRules: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/challenges/group/${challengeId}/rules`,
      }),
  
      // 단체 챌린지 참여하기
      participateGroup: (challengeId: number) => ({
        method: 'POST' as const,
        path: `/api/challenges/group/${challengeId}/participations`,
      }),
  
      // 개인 챌린지 인증 제출
      verifyPersonalChallenge: (challengeId: number) => ({
        method: 'POST' as const,
        path: `/api/challenges/personal/${challengeId}/verifications`,
      }),
  
      // 단체 챌린지 인증 제출
      verifyGroupChallenge: (challengeId: number) => ({
        method: 'POST' as const,
        path: `/api/challenges/group/${challengeId}/verifications`,
      }),
  
      // 챌린지 인증 결과 확인
      verificationResult: (challengeId: number) => ({
        method: 'GET' as const,
        path: `/api/verifications/${challengeId}/result`,
      }),
    },
    members: {
        // OAuth 로그인 시작
        oauth: (provider: string) => ({ method: 'GET' as const, path: `/oauth/${provider}` }),
        
        // OAuth 콜백
        callback: (provider: string) => ({ method: 'GET' as const, path: `/oauth/${provider}/callback` }),
        
        // 닉네임 중복 검사
        nickname: { method: 'GET' as const, path: '/api/members/nickname' },
        
        // 회원가입
        signup: { method: 'POST' as const, path: '/api/members/signup' },
        
        // 회원정보 수정
        modify: { method: 'PATCH' as const, path: '/api/members' },
        
        // 리프레시 토큰 제거
        removeToken: (provider: number | string) => ({ method: 'DELETE' as const, path: `/oauth/${provider}/token` }),
        
        // 토큰 재발급
        reissue: { method: 'POST' as const, path: '/auth/token/reissue' },
        
        // 회원 탈퇴
        delete: { method: 'DELETE' as const, path: '/api/members' },
        
        // 내 정보 조회
        detail: { method: 'GET' as const, path: '/api/members' },
        
        // 뱃지 조회
        badges: { method: 'GET' as const, path: '/api/members/badges' },
        
        // 나뭇잎 개수 조회
        leaves: { method: 'GET' as const, path: '/api/members/leaves' },
        
        // 프로필 카드 조회
        profilecard: { method: 'GET' as const, path: '/api/members/profilecard' },
        
        // 상품 구매 내역
        items: { method: 'GET' as const, path: '/api/members/products/list' },
        
        // 내가 만든 챌린지
        creations: { method: 'GET' as const, path: '/api/members/challenges/group/creations' },
        
        // 내가 참여한 챌린지
        participations: { method: 'GET' as const, path: '/api/members/challenges/group/participations' },
        
        // 챌린지 인증 내역
        verificationChellanges: (challengeId: number) => ({
            method: 'GET' as const,
            path: `/api/members/challenges/group/participations/${challengeId}/verifications`,
        }),
        
        // 챌린지 피드백 조회
        feedback: { method: 'GET' as const, path: '/api/members/feedback' },
        
        // 알림 조회
        notifications: { method: 'GET' as const, path: '/api/members/notifications' },
        
        // 알림 읽음 처리
        readNotifications: { method: 'PATCH' as const, path: '/api/members/notifications' },
    },
    s3: {
        // 이미지 업로드용 Presigned URL 요청
        presignedUrl: { method: 'POST' as const, path: '/s3/images/presigned-url' },
        
        // 이미지 실제 업로드 (PUT)
        images: { method: 'PUT' as const, path: '/s3/images' },
    },
    posts: {
        // 게시글 목록 조회
        list: { method: 'GET' as const, path: '/api/posts' },
      
        // 게시글 상세 조회
        detail: (postId: number) => ({
          method: 'GET' as const,
          path: `/api/posts/${postId}`,
        }),
      
        // 게시글 작성
        create: { method: 'POST' as const, path: '/api/posts' },
      
        // 게시글 수정
        update: (postId: number) => ({
          method: 'PATCH' as const,
          path: `/api/posts/${postId}`,
        }),
      
        // 게시글 삭제
        delete: (postId: number) => ({
          method: 'DELETE' as const,
          path: `/api/posts/${postId}`,
        }),
      
        // 댓글 목록 조회
        commentList: (postId: number) => ({
          method: 'GET' as const,
          path: `/api/posts/${postId}/comments`,
        }),
      
        // 댓글 작성
        createComment: (postId: number) => ({
          method: 'POST' as const,
          path: `/api/posts/${postId}/comments`,
        }),
      
        // 대댓글 작성
        createReply: (postId: number, commentId: number) => ({
          method: 'POST' as const,
          path: `/api/posts/${postId}/comments/${commentId}/replies`,
        }),
      
        // 댓글 수정
        updateComment: (postId: number, commentId: number) => ({
          method: 'PUT' as const,
          path: `/api/posts/${postId}/comments/${commentId}`,
        }),
      
        // 댓글 삭제
        deleteComment: (postId: number, commentId: number) => ({
          method: 'DELETE' as const,
          path: `/api/posts/${postId}/comments/${commentId}`,
        }),
      
        // 좋아요
        likePost: (postId: number) => ({
          method: 'POST' as const,
          path: `/api/posts/${postId}/likes`,
        }),
      
        // 좋아요 수 조회
        likeCount: (postId: number) => ({
          method: 'GET' as const,
          path: `/api/posts/${postId}/likes/count`,
        }),
    },
    store: {
        // 타임딜 상품 목록
        timedeals: { method: 'GET' as const, path: '/api/store/products/timedeals' },
      
        // 일반 상품 목록
        products: { method: 'GET' as const, path: '/api/store/products' },
      
        // 상품 주문
        orderProduct: (productId: number) => ({
          method: 'POST' as const,
          path: `/api/orders/${productId}`,
        }),
      
        // 타임딜 상품 주문
        orderDeal: (dealId: number) => ({
          method: 'POST' as const,
          path: `/api/orders/${dealId}`,
        }),
    },
    chatbot: {
        // 기본 정보 기반 챌린지 추천 요청 (일반)
        recommendByBaseInfo: { method: 'POST' as const, path: '/api/chatbot/recommendation/base-info' },
      
        // 자유 텍스트 기반 챌린지 추천 요청 (일반)
        recommendByFreeText: { method: 'POST' as const, path: '/api/chatbot/recommendation/free-text' },
    },
    admin: {
        // 이벤트 챌린지 생성
        createEventChallenge: { method: 'POST' as const, path: '/api/admin/challenges/event' },
      
        // 개인 챌린지 템플릿 목록 조회
        getPersonalTemplates: { method: 'GET' as const, path: '/api/admin/challenges/personal' },
      
        // 개인 챌린지 템플릿 생성
        createPersonalTemplate: { method: 'POST' as const, path: '/api/admin/challenges/personal' },
      
        // 개인 챌린지 템플릿 수정
        updatePersonalTemplate: (templateId: number) => ({
          method: 'PATCH' as const,
          path: `/api/admin/challenges/personal/${templateId}`,
        }),
      
        // 개인 챌린지 템플릿 삭제
        deletePersonalTemplate: (templateId: number) => ({
          method: 'DELETE' as const,
          path: `/api/admin/challenges/personal/${templateId}`,
        }),
      
        // 상품 등록
        createProduct: { method: 'POST' as const, path: '/api/admin/products' },
      
        // 타임딜 등록
        createTimedeal: { method: 'POST' as const, path: '/api/admin/timedeals' },
      
        // 상품 수정
        updateProduct: (productId: number) => ({
          method: 'PATCH' as const,
          path: `/api/admin/products/${productId}`,
        }),
      
        // 타임딜 수정
        updateTimedeal: (dealId: number) => ({
          method: 'PATCH' as const,
          path: `/api/admin/timedeals/${dealId}`,
        }),
      
        // 상품 삭제
        deleteProduct: (productId: number) => ({
          method: 'DELETE' as const,
          path: `/api/admin/products/${productId}`,
        }),
      
        // 타임딜 삭제
        deleteTimedeal: (dealId: number) => ({
          method: 'DELETE' as const,
          path: `/api/admin/timedeals/${dealId}`,
        }),
    }
} as const;